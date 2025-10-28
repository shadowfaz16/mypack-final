import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';
import { UserRole } from '@/types/database.types';

export interface UserWithRole {
  id: string;
  clerk_id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  branch_id: string | null;
}

/**
 * Gets the current user from Supabase based on Clerk session
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    const supabase = await createClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single();

    if (error || !user) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }

    return user as UserWithRole;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Checks if the current user has the specified role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Checks if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Checks if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Checks if the current user is an employee
 */
export async function isEmployee(): Promise<boolean> {
  return hasRole('empleado');
}

/**
 * Checks if the current user is a client
 */
export async function isClient(): Promise<boolean> {
  return hasRole('cliente');
}

/**
 * Requires the user to be authenticated, returns user or throws
 */
export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Requires the user to have a specific role, throws if not
 */
export async function requireRole(role: UserRole): Promise<UserWithRole> {
  const user = await requireAuth();
  
  if (user.role !== role) {
    throw new Error(`Role ${role} required`);
  }
  
  return user;
}

/**
 * Requires the user to have any of the specified roles
 */
export async function requireAnyRole(roles: UserRole[]): Promise<UserWithRole> {
  const user = await requireAuth();
  
  if (!roles.includes(user.role)) {
    throw new Error(`One of roles [${roles.join(', ')}] required`);
  }
  
  return user;
}

/**
 * Syncs a Clerk user to Supabase users table
 * Called from webhook when user signs up
 */
export async function syncClerkUserToSupabase(
  clerkId: string,
  email: string,
  fullName?: string
): Promise<void> {
  const supabase = await createClient();
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  if (existingUser) {
    // User already exists, update if needed
    await supabase
      .from('users')
      .update({
        email,
        full_name: fullName || null,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', clerkId);
  } else {
    // Create new user with default 'cliente' role
    await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        email,
        full_name: fullName || null,
        role: 'cliente',
      });
  }
}

/**
 * Gets user ID from Clerk ID
 */
export async function getUserIdFromClerkId(clerkId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}

/**
 * Updates user role (admin only operation)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<boolean> {
  const currentUserIsAdmin = await isAdmin();
  
  if (!currentUserIsAdmin) {
    throw new Error('Only admins can update user roles');
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);

  return !error;
}

/**
 * Assigns employee to branch (admin only operation)
 */
export async function assignEmployeeToBranch(
  userId: string,
  branchId: string
): Promise<boolean> {
  const currentUserIsAdmin = await isAdmin();
  
  if (!currentUserIsAdmin) {
    throw new Error('Only admins can assign employees to branches');
  }

  const supabase = await createClient();
  
  // Verify user is an employee
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (!user || user.role !== 'empleado') {
    throw new Error('User must be an employee to be assigned to a branch');
  }

  const { error } = await supabase
    .from('users')
    .update({ branch_id: branchId })
    .eq('id', userId);

  return !error;
}


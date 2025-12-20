import { useEffect, useState } from 'react';
import { dataStore, delay } from '@/lib/api';
import { createUser, deleteUser } from '@/lib/courseApi';
import { useAuth } from '@/contexts/AuthContext';
import type { User, UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, UserCheck, UserX, Plus, Trash2 } from 'lucide-react';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

export default function AdminUsersPage() {
  const { updateUserRole, toggleUserActive } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });

  const loadData = async () => {
    await delay(300, 500);
    setUsers([...dataStore.users]);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers([...dataStore.users]);
      toast({ title: 'Rol actualizado', description: `El rol ha sido cambiado a ${newRole}` });
    }
    setUpdatingUserId(null);
  };

  const handleToggleActive = async (userId: string) => {
    setUpdatingUserId(userId);
    const result = await toggleUserActive(userId);
    if (result.success) {
      setUsers([...dataStore.users]);
      toast({ title: result.data?.isActive ? 'Usuario activado' : 'Usuario desactivado' });
    }
    setUpdatingUserId(null);
  };

  const handleCreateUser = async (data: Omit<User, 'id' | 'createdAt' | 'avatar'>) => {
    const result = await createUser(data);
    if (result.success) {
      loadData();
      toast({ title: 'Usuario creado' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    await deleteUser(deleteModal.user.id);
    loadData();
    toast({ title: 'Usuario eliminado' });
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">Administra usuarios, roles y permisos</p>
        </div>
        <Button onClick={() => setUserModal(true)}><Plus className="h-4 w-4 mr-2" />Nuevo Usuario</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Usuarios ({users.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as UserRole)} disabled={updatingUserId === user.id}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={user.isActive ? 'status-active' : 'status-inactive'}>{user.isActive ? 'Activo' : 'Inactivo'}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(user.id)} disabled={updatingUserId === user.id}>
                  {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteModal({ open: true, user })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserFormModal open={userModal} onOpenChange={setUserModal} onSubmit={handleCreateUser} />
      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Eliminar Usuario"
        description={`¿Eliminar a "${deleteModal.user?.name}"? Se eliminarán sus inscripciones y progreso.`}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
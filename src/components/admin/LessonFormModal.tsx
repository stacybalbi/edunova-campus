import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Lesson } from '@/types';
import { Loader2 } from 'lucide-react';

interface LessonFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson | null;
  courseId: string;
  nextOrderNumber: number;
  onSubmit: (data: Omit<Lesson, 'id'>) => Promise<void>;
}

export function LessonFormModal({ open, onOpenChange, lesson, courseId, nextOrderNumber, onSubmit }: LessonFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: '',
    orderNumber: nextOrderNumber,
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || '',
        orderNumber: lesson.orderNumber,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        videoUrl: '',
        duration: '',
        orderNumber: nextOrderNumber,
      });
    }
  }, [lesson, nextOrderNumber, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        courseId,
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Editar Lección' : 'Nueva Lección'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL de video (opcional)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="15 min"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              type="number"
              min={1}
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: parseInt(e.target.value) || 1 })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lesson ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

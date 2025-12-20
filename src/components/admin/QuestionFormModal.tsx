import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Question, QuestionType } from '@/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface QuestionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question | null;
  existingOptions?: { id: string; text: string; isCorrect: boolean }[];
  quizId: string;
  onSubmit: (question: Omit<Question, 'id'>, options: { text: string; isCorrect: boolean }[]) => Promise<void>;
}

export function QuestionFormModal({ open, onOpenChange, question, existingOptions, quizId, onSubmit }: QuestionFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    type: 'multiple_choice' as QuestionType,
    points: 10,
  });
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  useEffect(() => {
    if (question && existingOptions) {
      setFormData({
        text: question.text,
        type: question.type,
        points: question.points || 10,
      });
      setOptions(existingOptions.map(o => ({ text: o.text, isCorrect: o.isCorrect })));
    } else {
      setFormData({
        text: '',
        type: 'multiple_choice',
        points: 10,
      });
      setOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    }
  }, [question, existingOptions, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validOptions = options.filter(o => o.text.trim());
      await onSubmit({ ...formData, quizId }, validOptions);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOption = (index: number, updates: Partial<{ text: string; isCorrect: boolean }>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    setOptions(newOptions);
  };

  const setCorrectOption = (index: number) => {
    setOptions(options.map((o, i) => ({ ...o, isCorrect: i === index })));
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      if (options[index].isCorrect && newOptions.length > 0) {
        newOptions[0].isCorrect = true;
      }
      setOptions(newOptions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Editar Pregunta' : 'Nueva Pregunta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Pregunta</Label>
            <Input
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as QuestionType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Opción múltiple</SelectItem>
                  <SelectItem value="true_false">Verdadero/Falso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Puntos</Label>
              <Input
                id="points"
                type="number"
                min={1}
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Opciones (marca la correcta)</Label>
              {options.length < 6 && (
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
              )}
            </div>
            <RadioGroup value={options.findIndex(o => o.isCorrect).toString()} onValueChange={(v) => setCorrectOption(parseInt(v))}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, { text: e.target.value })}
                    placeholder={`Opción ${index + 1}`}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {question ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

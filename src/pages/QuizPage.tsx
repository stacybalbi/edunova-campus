import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataStore, delay, generateId } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Quiz, Question, Option, Submission, SubmissionAnswer } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function QuizPage() {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [previousSubmission, setPreviousSubmission] = useState<Submission | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<Submission | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await delay(300, 500);

      const foundQuiz = dataStore.quizzes.find(q => q.id === quizId);
      if (!foundQuiz) {
        navigate(`/courses/${courseId}`);
        return;
      }

      const quizQuestions = dataStore.questions.filter(q => q.quizId === quizId);
      const questionIds = quizQuestions.map(q => q.id);
      const quizOptions = dataStore.options.filter(o => questionIds.includes(o.questionId));

      setQuiz(foundQuiz);
      setQuestions(quizQuestions);
      setOptions(quizOptions);

      // Check for previous submission
      if (user) {
        const prevSub = dataStore.submissions.find(
          s => s.quizId === quizId && s.studentId === user.id
        );
        if (prevSub) {
          setPreviousSubmission(prevSub);
          setShowResults(true);
          setCurrentResult(prevSub);
        }
      }

      if (foundQuiz.timeLimit) {
        setTimeRemaining(foundQuiz.timeLimit * 60);
      }

      setIsLoading(false);
    };

    loadData();
  }, [courseId, quizId, user, navigate]);

  // Timer
  useEffect(() => {
    if (timeRemaining === null || showResults || previousSubmission) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults, previousSubmission]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!user || !quiz) return;

    setIsSubmitting(true);
    await delay(400, 600);

    // Calculate score
    let correctCount = 0;
    const submissionAnswers: SubmissionAnswer[] = [];

    questions.forEach(question => {
      const selectedOptionId = answers[question.id];
      const correctOption = options.find(
        o => o.questionId === question.id && o.isCorrect
      );
      const isCorrect = selectedOptionId === correctOption?.id;

      if (isCorrect) correctCount++;

      submissionAnswers.push({
        questionId: question.id,
        selectedOptionId: selectedOptionId || '',
        isCorrect,
      });
    });

    const maxScore = questions.length * 10;
    const score = correctCount * 10;

    const submission: Submission = {
      id: generateId('submission'),
      quizId: quiz.id,
      studentId: user.id,
      score,
      maxScore,
      submittedAt: new Date().toISOString(),
      answers: submissionAnswers,
    };

    dataStore.submissions.push(submission);
    setCurrentResult(submission);
    setShowResults(true);
    setIsSubmitting(false);

    toast({
      title: 'Quiz completado',
      description: `Tu puntuación: ${score}/${maxScore}`,
    });
  };

  const handleRetake = () => {
    // Remove previous submission
    const subIndex = dataStore.submissions.findIndex(
      s => s.quizId === quizId && s.studentId === user?.id
    );
    if (subIndex !== -1) {
      dataStore.submissions.splice(subIndex, 1);
    }

    setPreviousSubmission(null);
    setShowResults(false);
    setCurrentResult(null);
    setAnswers({});
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) return null;

  // Results view
  if (showResults && currentResult) {
    const percentage = Math.round((currentResult.score / currentResult.maxScore) * 100);
    const passed = percentage >= 60;

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Button variant="ghost" asChild className="-ml-2 mb-6">
          <Link to={`/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al curso
          </Link>
        </Button>

        <Card className="text-center">
          <CardContent className="py-12">
            <div
              className={cn(
                'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full',
                passed ? 'bg-success/10' : 'bg-destructive/10'
              )}
            >
              {passed ? (
                <Trophy className="h-12 w-12 text-success" />
              ) : (
                <XCircle className="h-12 w-12 text-destructive" />
              )}
            </div>

            <h1 className="font-display text-3xl font-bold mb-2">
              {passed ? '¡Felicitaciones!' : 'Sigue practicando'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {passed
                ? 'Has aprobado el quiz con éxito'
                : 'No te preocupes, puedes volver a intentarlo'}
            </p>

            <div className="text-5xl font-bold mb-2">
              <span className={passed ? 'text-success' : 'text-destructive'}>
                {percentage}%
              </span>
            </div>
            <p className="text-muted-foreground mb-8">
              {currentResult.score} de {currentResult.maxScore} puntos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={handleRetake}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Volver a intentar
              </Button>
              <Button asChild>
                <Link to={`/courses/${courseId}`}>Volver al curso</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed results */}
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-semibold">Revisión de respuestas</h2>
          {questions.map((question, index) => {
            const answer = currentResult.answers.find(a => a.questionId === question.id);
            const questionOptions = options.filter(o => o.questionId === question.id);
            const correctOption = questionOptions.find(o => o.isCorrect);

            return (
              <Card key={question.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0',
                        answer?.isCorrect
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {answer?.isCorrect ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.text}
                      </p>
                      <div className="space-y-1 text-sm">
                        {questionOptions.map(option => (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded',
                              option.id === answer?.selectedOptionId &&
                                !option.isCorrect &&
                                'bg-destructive/10',
                              option.isCorrect && 'bg-success/10'
                            )}
                          >
                            {option.isCorrect && (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            {option.id === answer?.selectedOptionId && !option.isCorrect && (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz taking view
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild className="-ml-2">
          <Link to={`/courses/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Link>
        </Button>

        {timeRemaining !== null && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full font-medium',
              timeRemaining < 60
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Quiz info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {answeredCount} de {questions.length} preguntas respondidas
            </span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const questionOptions = options.filter(o => o.questionId === question.id);

          return (
            <Card key={question.id}>
              <CardContent className="p-6">
                <p className="font-medium mb-4">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  {question.text}
                </p>

                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="space-y-2">
                    {questionOptions.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          'flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
                          answers[question.id] === option.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        )}
                        onClick={() => handleAnswerChange(question.id, option.id)}
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting || answeredCount < questions.length}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviar respuestas
            </>
          )}
        </Button>
      </div>

      {answeredCount < questions.length && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Debes responder todas las preguntas para enviar el quiz
        </p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { formatDistanceStrict } from "date-fns";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimerDisplayProps {
  lastMealTime: Date | null;
}

export function TimerDisplay({ lastMealTime }: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState<string>("No meals logged");
  const { toast } = useToast();

  const logMeal = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/meals", {});
    },
    onSuccess: () => {
      toast({
        title: "Meal logged successfully",
        description: "Your meal has been recorded",
      });
    },
  });

  useEffect(() => {
    if (!lastMealTime) return;

    const timer = setInterval(() => {
      setElapsed(formatDistanceStrict(new Date(), lastMealTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [lastMealTime]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="pt-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Time Since Last Meal</h2>
        <div className="text-4xl font-bold text-primary mb-6">{elapsed}</div>
        <Button
          size="lg"
          className="w-full max-w-sm"
          onClick={() => logMeal.mutate()}
          disabled={logMeal.isPending}
        >
          <Utensils className="mr-2 h-5 w-5" />
          Log Meal Now
        </Button>
      </CardContent>
    </Card>
  );
}

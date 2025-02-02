import { useQuery } from "@tanstack/react-query";
import { TimerDisplay } from "@/components/timer-display";
import { MealHistory } from "@/components/meal-history";
import type { SelectMeal } from "@db/schema";

export default function Dashboard() {
  const { data: meals = [] } = useQuery<SelectMeal[]>({
    queryKey: ["/api/meals"],
  });

  const lastMeal = meals[0]?.timestamp ? new Date(meals[0].timestamp) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <TimerDisplay lastMealTime={lastMeal} />
        <MealHistory meals={meals} limit={5} />
      </div>
    </div>
  );
}

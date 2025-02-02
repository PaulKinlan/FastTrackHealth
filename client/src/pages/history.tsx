import { useQuery } from "@tanstack/react-query";
import { MealHistory } from "@/components/meal-history";
import type { SelectMeal } from "@db/schema";

export default function History() {
  const { data: meals = [] } = useQuery<SelectMeal[]>({
    queryKey: ["/api/meals"],
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Meal History</h1>
      <MealHistory meals={meals} />
    </div>
  );
}

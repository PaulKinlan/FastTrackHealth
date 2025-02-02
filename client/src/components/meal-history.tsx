import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";

interface Meal {
  id: number;
  timestamp: string;
}

interface MealHistoryProps {
  meals: Meal[];
  limit?: number;
}

export function MealHistory({ meals, limit }: MealHistoryProps) {
  const displayMeals = limit ? meals.slice(0, limit) : meals;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayMeals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="text-sm">
                {format(new Date(meal.timestamp), "PPp")}
              </div>
            </div>
          ))}
          {displayMeals.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No meals logged yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from "./ui/card";
import { formatAddress, formatBalance } from "../utils";
import { Button } from "./ui/button";
import { Loan } from "../hooks/use-agency";

export function LendingCard({
  isOwner,
  loan,
  borrow,
  repay,
}: {
  isOwner: boolean;
  loan: Loan | undefined;
  borrow: () => void;
  repay: () => void;
}) {
  console.log(`loan:`, loan);
  if (loan) {
    return (
      <Card className="mb-2">
        <CardHeader>Loan: {String(loan.id)}</CardHeader>
        <CardContent>
          {formatAddress(loan.borrower)}: {formatBalance(loan.availableFunds)}
          {isOwner ? null : (
            <div className="flex flex-row-reverse gap-2">
              <Button onClick={repay}>Repay</Button>
              <Button onClick={borrow}>Borrow</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  return null;
}

import { Button } from "../components/ui/button";
import { Loan, useAgency } from "../hooks/use-agency";
import { LendingCard } from "../components/lending-card";
import { useState } from "react";
import { LendingForm } from "../components/lending-form";

function renderLoans(
  isOwner: boolean,
  loans: Loan[],
  borrow: (loanId: number) => void,
  repay: (loanId: number) => void
) {
  if (!loans.length) {
    return <i>No Lending found</i>;
  }

  return loans.map((loan) => (
    <LendingCard
      key={loan.id}
      isOwner={isOwner}
      loan={loan}
      borrow={() => borrow(loan.id)}
      repay={() => repay(loan.id)}
    />
  ));
}

export default function Home() {
  const { isOwner, loans, grantLend, borrow, repay } = useAgency();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {isOwner &&
        (showForm ? (
          <LendingForm save={grantLend} cancel={() => setShowForm(false)} />
        ) : (
          <Button onClick={() => setShowForm(true)}>Create lending</Button>
        ))}

      <div className="mt-5">{renderLoans(isOwner, loans, borrow, repay)}</div>
    </>
  );
}

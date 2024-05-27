import { useEffect, useMemo, useState } from "react";
import { useMetaMask } from "./use-metamask";
import { Contract, ethers } from "ethers";
import { getAgencyContract } from "../lib/lendig-agency";

export type Loan = {
  id: number;
  availableFunds: string;
  borrower: string;
};

const DAY = 24 * 60 * 60;

const listLoans = async (
  isOwner: boolean,
  agency: Contract,
  account: string
): Promise<Loan[]> => {
  if (isOwner) {
    const loans = await agency?.getLoans();
    console.log(loans);
    return loans ?? [];
  } else {
    const loanIds = await agency?.getUserLoanIds(account);
    const loans = await Promise.all(
      loanIds.map((id: number) => agency?.loans(id))
    );
    return loans ?? [];
  }
};

export const useAgency = () => {
  const { hasProvider, wallet } = useMetaMask();

  const [agency, setAgency] = useState<Contract | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    function handleLoanGrantedEvent() {
      if (agency) {
        listLoans(isOwner, agency, wallet.accounts[0]);
      }
    }
    agency?.addListener("LoanGranted", handleLoanGrantedEvent);
    agency?.addListener("LoanBorrowed", handleLoanGrantedEvent);
    agency?.addListener("LoanRepaid", handleLoanGrantedEvent);
    return () => {
      agency?.removeAllListeners();
    };
  }, [isOwner, agency, wallet.accounts]);

  useEffect(() => {
    async function retrieveContract() {
      const agency = await getAgencyContract();
      setAgency(agency);
    }
    retrieveContract();
  }, [wallet.accounts]);

  useEffect(() => {
    async function checkOwner() {
      const owner: string | undefined = await agency?.owner();
      const isOwner =
        (wallet.accounts[0] ?? "").toLowerCase() === owner?.toLowerCase();
      setIsOwner(isOwner);
    }
    checkOwner();
  }, [wallet.accounts, agency]);

  useEffect(() => {
    async function fetchLending() {
      console.log("fetchLendings", agency);
      if (agency) {
        const loans = await listLoans(isOwner, agency, wallet.accounts[0]);
        setLoans(loans);
      } else {
        setLoans([]);
      }
    }
    fetchLending();
  }, [isOwner, agency, setLoans, wallet.accounts]);

  const grantLend = useMemo(
    () => (account: string, amount: string) => {
      if (isOwner) {
        agency
          ?.grantLoan(account, 30 * DAY, 10, {
            value: ethers.parseEther(amount),
          })
          .then(() => {
            listLoans(isOwner, agency, "").then((loans) => {
              setLoans(loans);
            });
          });
      }
    },
    [isOwner, agency]
  );

  const borrow = useMemo(
    () => (loanId: number) => {
      agency?.borrow(loanId).then(() => console.log("borrowed"));
    },
    [agency]
  );

  const repay = useMemo(
    () => (loanId: number) => {
      agency?.repay(loanId).then(() => console.log("repaid"));
    },
    [agency]
  );

  if (!hasProvider) {
    return {
      isOwner: false,
      loans: [],
      grantLend,
      borrow,
      repay,
    };
  }

  return {
    isOwner,
    loans,
    grantLend,
    borrow,
    repay,
  };
};

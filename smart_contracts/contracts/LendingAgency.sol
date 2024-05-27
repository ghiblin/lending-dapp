// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

// import "./Lending.sol";

contract LendingAgency {
    struct Loan {
        uint256 id;
        uint256 availableFunds;
        address borrower;
        uint256 interest;
        uint256 repayTime;
        uint256 repayed;
        uint256 loanStartTime;
        uint256 borrowed;
        bool isLoanActive;
    }

    uint256 public currentLoanId = 0;
    Loan[] public loans;
    mapping(address => uint256[]) public userLoanIds;
    address public owner;

    event LoanGranted(
        uint256 indexed id,
        uint256 availableFunds,
        address borrower
    );
    event LoanBorrowed(uint256 indexed id, address borrower);
    event LoanRepaid(uint256 indexed id, address borrower);

    constructor() {
        owner = msg.sender;
    }

    function grantLoan(
        address _borrower,
        uint256 _repayTime,
        uint256 _interest
    ) public payable {
        require(msg.sender == owner, "You must be the owner of the agency");
        loans.push(
            Loan(
                currentLoanId,
                msg.value,
                payable(_borrower),
                _interest,
                _repayTime,
                0,
                0,
                0,
                false
            )
        );
        userLoanIds[_borrower].push(currentLoanId);
        emit LoanGranted(currentLoanId, msg.value, _borrower);
        currentLoanId++;
    }

    function getLoans() public view returns (Loan[] memory) {
        return loans;
    }

    function getUserLoanIds(
        address _borrower
    ) public view returns (uint256[] memory) {
        return userLoanIds[_borrower];
    }

    function borrow(uint256 _loanId) public payable {
        require(
            msg.sender == loans[_loanId].borrower,
            "You must be the borrower"
        );
        require(loans[_loanId].availableFunds > 0, "No funds available");
        require(
            block.timestamp >
                loans[_loanId].loanStartTime + loans[_loanId].repayTime,
            "Loan expired must be repayed first"
        );

        if (loans[_loanId].borrowed == 0) {
            loans[_loanId].loanStartTime = block.timestamp;
        }
        uint256 _amount = loans[_loanId].availableFunds;
        loans[_loanId].availableFunds = 0;
        loans[_loanId].borrowed = _amount;
        loans[_loanId].isLoanActive = true;
        payable(msg.sender).transfer(_amount);
        emit LoanBorrowed(_loanId, msg.sender);
    }

    function repay(uint256 _loanId) public payable {
        require(
            msg.sender == loans[_loanId].borrower,
            "You must be the borrower"
        );
        require(loans[_loanId].isLoanActive, "Must be an active loan");
        uint256 amountToRepay = loans[_loanId].borrowed +
            ((loans[_loanId].borrowed * loans[_loanId].interest) / 100);
        uint256 leftToPay = amountToRepay - loans[_loanId].repayed;
        uint256 exceeding = 0;

        if (msg.value > leftToPay) {
            exceeding = msg.value - leftToPay;
            loans[_loanId].isLoanActive = false;
        } else if (msg.value == leftToPay) {
            loans[_loanId].isLoanActive = false;
        } else {
            loans[_loanId].repayed = loans[_loanId].repayed + msg.value;
        }

        payable(owner).transfer(msg.value - exceeding);
        if (exceeding > 0) {
            payable(msg.sender).transfer(exceeding);
        }

        // Reset everything
        if (!loans[_loanId].isLoanActive) {
            loans[_loanId].borrowed = 0;
            loans[_loanId].availableFunds = 0;
            loans[_loanId].repayed = 0;
            loans[_loanId].loanStartTime = 0;
        }
        emit LoanRepaid(_loanId, msg.sender);
    }
}

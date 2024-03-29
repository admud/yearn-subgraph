import { Account, AccountVaultBalance } from "../../../../generated/schema";
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from "../../constants";

export function getOrCreateAccount(
  id: string,
  createIfNotFound: boolean = true
): Account {
  let account = Account.load(id);

  if (account == null && createIfNotFound) {
    account = new Account(id);
  }

  return account as Account;
}

export function getOrCreateAccountVaultBalance(
  id: string,
  createIfNotFound: boolean = true
): AccountVaultBalance {
  let balance = AccountVaultBalance.load(id);

  if (balance == null && createIfNotFound) {
    balance = new AccountVaultBalance(id);

    // Initiallize all decimal parsed values as BigDecimal 0
    balance.netDeposits = BIGDECIMAL_ZERO;
    balance.totalDeposited = BIGDECIMAL_ZERO;
    balance.totalWithdrawn = BIGDECIMAL_ZERO;
    balance.totalSent = BIGDECIMAL_ZERO;
    balance.totalReceived = BIGDECIMAL_ZERO;
    balance.shareBalance = BIGDECIMAL_ZERO;
    balance.totalSharesMinted = BIGDECIMAL_ZERO;
    balance.totalSharesBurned = BIGDECIMAL_ZERO;
    balance.totalSharesSent = BIGDECIMAL_ZERO;
    balance.totalSharesReceived = BIGDECIMAL_ZERO;

    // Initialize all raw values as BigInt 0
    balance.netDepositsRaw = BIGINT_ZERO;
    balance.totalDepositedRaw = BIGINT_ZERO;
    balance.totalWithdrawnRaw = BIGINT_ZERO;
    balance.totalSentRaw = BIGINT_ZERO;
    balance.totalReceivedRaw = BIGINT_ZERO;
    balance.shareBalanceRaw = BIGINT_ZERO;
    balance.totalSharesMintedRaw = BIGINT_ZERO;
    balance.totalSharesBurnedRaw = BIGINT_ZERO;
    balance.totalSharesSentRaw = BIGINT_ZERO;
    balance.totalSharesReceivedRaw = BIGINT_ZERO;
  }

  return balance as AccountVaultBalance;
}

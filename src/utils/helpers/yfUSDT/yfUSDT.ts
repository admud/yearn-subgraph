import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { Deposit, Farmer, Transaction, Transfer, Withdrawal } from "../../../../generated/schema";
import { yfUSDT } from "../../../../generated/yfUSDT/yfUSDT";
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "../../constants";
import { toDecimal } from "../../decimals";
import { getOrCreateToken } from "./token";
import { getOrCreateEarnFarmerToken, getOrCreateVaultFarmerToken } from "./farmerToken";

export function getOrCreateFarmer(
  vaultAddress: Address,
  update: boolean = true
): Farmer {
  let vault = Farmer.load(vaultAddress.toHexString());
  let vaultContract = yfUSDT.bind(vaultAddress);

  if (vault == null) {
    vault = new Farmer(vaultAddress.toHexString());

    // Initialize parsed values as BigDecimal 0
    vault.pricePerFullShare = BIGDECIMAL_ZERO;
    vault.netDeposits = BIGDECIMAL_ZERO;
    vault.totalDeposited = BIGDECIMAL_ZERO;
    vault.totalWithdrawn = BIGDECIMAL_ZERO;
    vault.totalActiveShares = BIGDECIMAL_ZERO;
    vault.totalSharesMinted = BIGDECIMAL_ZERO;
    vault.totalSharesBurned = BIGDECIMAL_ZERO;
    vault.earnBalance = BIGDECIMAL_ZERO;
    vault.vaultBalance = BIGDECIMAL_ZERO;
    vault.totalSupply = BIGDECIMAL_ZERO;
    vault.totalEarnings = BIGDECIMAL_ZERO;

    // Initialize raw values as BigInt 0
    vault.netDepositsRaw = BIGINT_ZERO;
    vault.totalDepositedRaw = BIGINT_ZERO;
    vault.totalWithdrawnRaw = BIGINT_ZERO;
    vault.totalActiveSharesRaw = BIGINT_ZERO;
    vault.totalSharesMintedRaw = BIGINT_ZERO;
    vault.totalSharesBurnedRaw = BIGINT_ZERO;
    vault.vaultBalanceRaw = BIGINT_ZERO;
    vault.totalSupplyRaw = BIGINT_ZERO;
    vault.totalEarningsRaw = BIGINT_ZERO;
    vault.pricePerFullShareRaw = BIGINT_ZERO;
  }

  if (update) {
    // Might be worth using the "try_" version of these calls in the future.
    let underlyingTokenAddress = vaultContract.token();
    let underlyingToken = getOrCreateToken(underlyingTokenAddress);

    // Earn Token
    let earnTokenAddress = vaultContract.earn();
    let earnToken = getOrCreateEarnFarmerToken(earnTokenAddress)

    // Vault Token
    let vaultTokenAddress = vaultContract.vault();
    let vaultToken = getOrCreateVaultFarmerToken(vaultTokenAddress)

    // The vault itself is an ERC20
    let shareToken = getOrCreateToken(vaultAddress);
    
    let totalSupply = vaultContract.try_totalSupply();

    vault.earnBalanceRaw = earnToken.balanceRaw;
    vault.vaultBalanceRaw = vaultToken.balanceRaw;
    vault.pricePerFullShareRaw = (earnToken.getPricePerFullShare.plus(vaultToken.getPricePerFullShare)).div(BigInt.fromI32(2));
    vault.totalSupplyRaw = !totalSupply.reverted
      ? totalSupply.value
      : vault.totalSupplyRaw;
    vault.underlyingToken = underlyingToken.id;
    vault.shareToken = shareToken.id;

    vault.earnBalance = toDecimal(
      vault.earnBalanceRaw,
      earnToken.decimals
    );
    vault.vaultBalance = toDecimal(
      vault.vaultBalanceRaw,
      vaultToken.decimals
    );
    vault.totalSupply = toDecimal(
      vault.totalSupplyRaw,
      underlyingToken.decimals
    );
    // Uses the default decimals since it's a floating point representation
    vault.pricePerFullShare = toDecimal(vault.pricePerFullShareRaw, underlyingToken.decimals);
  }

  return vault as Farmer;
}

export function getOrCreateTransaction(
  id: string,
  createIfNotFound: boolean = true
): Transaction {
  let transaction = Transaction.load(id);

  if (transaction == null && createIfNotFound) {
    transaction = new Transaction(id);
  }

  return transaction as Transaction;
}

export function getOrCreateVaultDeposit(
  id: string,
  createIfNotFound: boolean = true
): Deposit {
  let action = Deposit.load(id);

  if (action == null && createIfNotFound) {
    action = new Deposit(id);
  }

  return action as Deposit;
}

export function getOrCreateVaultTransfer(
  id: string,
  createIfNotFound: boolean = true
): Transfer {
  let action = Transfer.load(id);

  if (action == null && createIfNotFound) {
    action = new Transfer(id);
  }

  return action as Transfer;
}

export function getOrCreateVaultWithdrawal(
  id: string,
  createIfNotFound: boolean = true
): Withdrawal {
  let action = Withdrawal.load(id);

  if (action == null && createIfNotFound) {
    action = new Withdrawal(id);
  }

  return action as Withdrawal;
}
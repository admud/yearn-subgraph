import { Address } from "@graphprotocol/graph-ts";
import { FarmerToken } from "../../../../generated/schema";
import { BIGINT_ZERO } from "../../constants";
import { DEFAULT_DECIMALS } from "../../decimals";
import { yEarn } from '../../../../generated/YearnFighterUSDT/yEarn';
import { yVault } from '../../../../generated/YearnFighterUSDT/yVault';

export function getOrCreateEarnFarmerToken(
  tokenAddress: Address,
  persist: boolean = true
): FarmerToken {
  let addressString = tokenAddress.toHexString();

  let token = FarmerToken.load(addressString);

  if (token == null) {
    token = new FarmerToken(addressString);
    token.address = tokenAddress;

    let farmerToken = yEarn.bind(tokenAddress);

    let tokenDecimals = farmerToken.try_decimals();
    let tokenName = farmerToken.try_name();
    let tokenSymbol = farmerToken.try_symbol();
    let tokenGetPricePerFullShare = farmerToken.try_getPricePerFullShare();
    let tokenBalance = farmerToken.try_balance();

    token.decimals = !tokenDecimals.reverted
      ? tokenDecimals.value
      : DEFAULT_DECIMALS;
    token.name = !tokenName.reverted ? tokenName.value : "";
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : "";
    token.balanceRaw = !tokenBalance.reverted ? tokenBalance.value : BIGINT_ZERO;
    token.getPricePerFullShare = !tokenGetPricePerFullShare.reverted ? tokenGetPricePerFullShare.value : BIGINT_ZERO;

    if (persist) {
      token.save();
    }
  }

  return token as FarmerToken;
}

export function getOrCreateVaultFarmerToken(
  tokenAddress: Address,
  persist: boolean = true
): FarmerToken {
  let addressString = tokenAddress.toHexString();

  let token = FarmerToken.load(addressString);

  if (token == null) {
    token = new FarmerToken(addressString);
    token.address = tokenAddress;

    let farmerToken = yVault.bind(tokenAddress);

    let tokenDecimals = farmerToken.try_decimals();
    let tokenName = farmerToken.try_name();
    let tokenSymbol = farmerToken.try_symbol();
    let tokenGetPricePerFullShare = farmerToken.try_getPricePerFullShare();
    let tokenBalance = farmerToken.try_balance();

    token.decimals = !tokenDecimals.reverted
      ? tokenDecimals.value
      : DEFAULT_DECIMALS;
    token.name = !tokenName.reverted ? tokenName.value : "";
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : "";
    token.balanceRaw = !tokenBalance.reverted ? tokenBalance.value : BIGINT_ZERO;
    token.getPricePerFullShare = !tokenGetPricePerFullShare.reverted ? tokenGetPricePerFullShare.value : BIGINT_ZERO;

    if (persist) {
      token.save();
    }
  }

  return token as FarmerToken;
}
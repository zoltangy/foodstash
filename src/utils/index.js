import { isBefore, addDays } from "date-fns";

const getExpirySetting = (expiryLimit) => {
  return expiryLimit.timeperiod === "week" ? expiryLimit.amount * 7 : expiryLimit.amount;
};

const isExpiring = (itemExpiration, expiryLimit) => {
  if (!itemExpiration) return false;
  return isBefore(itemExpiration.toDate(), addDays(new Date(), getExpirySetting(expiryLimit)));
};

const getItemCount = (items, expiryLimit) => {
  let total = 0;
  let expiring = 0;
  items.forEach((item) => {
    total += item.amount;
    if (isExpiring(item.expiration, expiryLimit)) {
      expiring += item.amount;
    }
  });
  return { total, expiring };
};

export { getItemCount, isExpiring };

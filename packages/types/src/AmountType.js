export const AmountType = {
  none: "none",
  earlierAmount: "earlierAmount",
  laterAmount: "laterAmount",
};

Object.freeze(AmountType);

export const isAmountChoice = (choice) => {
  return (
    choice === AmountType.laterAmount || choice === AmountType.earlierAmount
  );
};

import { BloodType } from "generated/prisma/enums";

export const BLOOD_COMPATIBILITY:
  Record<BloodType, BloodType[]> = {

  [BloodType.O_NEG]: [
    BloodType.O_NEG,
    BloodType.O_POS,
    BloodType.A_NEG,
    BloodType.A_POS,
    BloodType.B_NEG,
    BloodType.B_POS,
    BloodType.AB_NEG,
    BloodType.AB_POS,
  ],

  [BloodType.O_POS]: [
    BloodType.O_POS,
    BloodType.A_POS,
    BloodType.B_POS,
    BloodType.AB_POS,
  ],

  [BloodType.A_NEG]: [
    BloodType.A_NEG,
    BloodType.A_POS,
    BloodType.AB_NEG,
    BloodType.AB_POS,
  ],

  [BloodType.A_POS]: [
    BloodType.A_POS,
    BloodType.AB_POS,
  ],

  [BloodType.B_NEG]: [
    BloodType.B_NEG,
    BloodType.B_POS,
    BloodType.AB_NEG,
    BloodType.AB_POS,
  ],

  [BloodType.B_POS]: [
    BloodType.B_POS,
    BloodType.AB_POS,
  ],

  [BloodType.AB_NEG]: [
    BloodType.AB_NEG,
    BloodType.AB_POS,
  ],

  [BloodType.AB_POS]: [
    BloodType.AB_POS,
  ],
};
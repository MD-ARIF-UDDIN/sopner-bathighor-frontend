/**
 * Investment calculation helpers (mirrors backend/utils/investmentCalculations.js).
 */

export const calcReturnTarget = (P, R) => {
  const principal = parseFloat(P);
  const rate = parseFloat(R);
  if (isNaN(principal) || isNaN(rate) || principal <= 0) return null;
  return principal + (principal * rate) / 100;
};

export const calcInterestPercent = (P, T) => {
  const principal = parseFloat(P);
  const target = parseFloat(T);
  if (isNaN(principal) || isNaN(target) || principal <= 0) return null;
  return ((target - principal) / principal) * 100;
};

export const calcMonthlyInstallment = (T, N) => {
  const target = parseFloat(T);
  const duration = parseInt(N, 10);
  if (isNaN(target) || isNaN(duration) || duration <= 0) return null;
  return target / duration;
};

export const formatCalcNumber = (num) => {
  if (num == null || isNaN(num)) return '';
  const rounded = Math.round(num * 10000) / 10000;
  return String(rounded);
};

/**
 * Recalculate linked form fields after an investment field change.
 */
export const recalcInvestmentFields = (form, lastEdited) => {
  const P = parseFloat(form.investmentAmount);
  const N = parseInt(form.installmentDuration, 10);
  const updated = { ...form, lastEdited };

  if (!isNaN(P) && P > 0) {
    if (lastEdited === 'returnAmount') {
      const T = parseFloat(form.returnAmount);
      if (!isNaN(T)) {
        updated.interestPercentage = formatCalcNumber(calcInterestPercent(P, T));
      }
    } else if (lastEdited === 'percentage') {
      const R = parseFloat(form.interestPercentage);
      if (!isNaN(R)) {
        updated.returnAmount = formatCalcNumber(calcReturnTarget(P, R));
      }
    } else if (lastEdited === 'investment') {
      if (form.lastEdited === 'returnAmount') {
        const T = parseFloat(form.returnAmount);
        if (!isNaN(T)) {
          updated.interestPercentage = formatCalcNumber(calcInterestPercent(P, T));
        }
      } else {
        const R = parseFloat(form.interestPercentage);
        if (!isNaN(R)) {
          updated.returnAmount = formatCalcNumber(calcReturnTarget(P, R));
        }
      }
    }
  }

  const T = parseFloat(updated.returnAmount);
  if (!isNaN(T) && !isNaN(N) && N > 0) {
    updated.monthlyInstallmentAmount = formatCalcNumber(calcMonthlyInstallment(T, N));
  }

  return updated;
};

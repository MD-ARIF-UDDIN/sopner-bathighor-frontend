/**
 * Investment calculation helpers (mirrors backend/utils/investmentCalculations.js).
 *
 * Flow:
 *  1. investmentAmount (P) + interestPercentage (R) → returnAmount (T) = P + (P * R / 100)
 *  2. returnAmount (T) + installmentDuration (N)   → monthlyInstallmentAmount = T / N
 *
 * Early payment logic (for display):
 *  - monthlyInterest = (T - P) / N
 *  - If paid in K months: totalPayable = P + monthlyInterest * K
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
 *
 * Supported lastEdited values:
 *  - 'investment' : recalc returnAmount from P & R (or from existing returnAmount if no R)
 *  - 'percentage' : recalc returnAmount from P & R
 *  - 'duration'   : recalc monthlyInstallmentAmount from T & N
 *  - 'returnAmount': recalc interestPercentage from P & T (back-compute mode)
 */
export const recalcInvestmentFields = (form, lastEdited) => {
  const P = parseFloat(form.investmentAmount);
  const N = parseInt(form.installmentDuration, 10);
  const updated = { ...form, lastEdited };

  if (!isNaN(P) && P > 0) {
    if (lastEdited === 'percentage') {
      // P + R → T
      const R = parseFloat(form.interestPercentage);
      if (!isNaN(R)) {
        updated.returnAmount = formatCalcNumber(calcReturnTarget(P, R));
      }
    } else if (lastEdited === 'investment') {
      // When investment changes, re-derive T from whichever was last set (R preferred)
      const R = parseFloat(form.interestPercentage);
      if (!isNaN(R)) {
        updated.returnAmount = formatCalcNumber(calcReturnTarget(P, R));
      }
    } else if (lastEdited === 'returnAmount') {
      // Back-compute: T → R (if user types return amount directly)
      const T = parseFloat(form.returnAmount);
      if (!isNaN(T)) {
        updated.interestPercentage = formatCalcNumber(calcInterestPercent(P, T));
      }
    }
    // 'duration' case: nothing changes P/R/T
  }

  // Always recalc monthly installment from T & N
  const T = parseFloat(updated.returnAmount);
  if (!isNaN(T) && !isNaN(N) && N > 0) {
    updated.monthlyInstallmentAmount = formatCalcNumber(calcMonthlyInstallment(T, N));
  } else if (lastEdited === 'duration' && isNaN(N)) {
    updated.monthlyInstallmentAmount = '';
  }

  return updated;
};

export const getProjectDurationDisplay = (project, calculations) => {
  const m = calculations || project;
  const settled = m.isSettled ?? (project.status === 'completed' || m.remainingBalance === 0);
  const months = m.durationMonths ?? (settled ? m.activeMonths : m.monthsElapsed);
  return {
    months,
    label: settled ? 'সম্পন্ন' : 'চলমান',
    suffix: settled ? 'মাসে' : 'মাস',
  };
};

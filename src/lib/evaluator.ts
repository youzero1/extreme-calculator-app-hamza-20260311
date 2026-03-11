import { create, all } from 'mathjs';
import { factorial, PHI, nthRoot, logBase, toRadians, toDegrees } from './scientific';

const math = create(all);

export function evaluateExpression(expression: string, angleMode: 'deg' | 'rad' = 'rad'): string {
  try {
    let expr = expression.trim();

    // Replace constants
    expr = expr.replace(/\bpi\b/gi, String(Math.PI));
    expr = expr.replace(/\bπ\b/g, String(Math.PI));
    expr = expr.replace(/\bphi\b/gi, String(PHI));
    expr = expr.replace(/\bφ\b/g, String(PHI));

    // Replace scientific notation shorthand
    expr = expr.replace(/([\d.]+)e([\d.]+)/gi, (_, base, exp) => {
      return String(parseFloat(base) * Math.pow(10, parseFloat(exp)));
    });

    // Handle factorial
    expr = expr.replace(/(\d+(?:\.\d+)?)!/g, (_, num) => {
      return String(factorial(parseFloat(num)));
    });

    // Replace nthRoot(x, n)
    expr = expr.replace(/nthRoot\(([^,]+),([^)]+)\)/g, (_, x, n) => {
      const xVal = parseFloat(evaluateExpression(x.trim(), angleMode));
      const nVal = parseFloat(evaluateExpression(n.trim(), angleMode));
      return String(nthRoot(xVal, nVal));
    });

    // Replace logBase(x, n)
    expr = expr.replace(/logBase\(([^,]+),([^)]+)\)/g, (_, x, n) => {
      const xVal = parseFloat(evaluateExpression(x.trim(), angleMode));
      const nVal = parseFloat(evaluateExpression(n.trim(), angleMode));
      return String(logBase(xVal, nVal));
    });

    // Handle trig functions based on angle mode
    if (angleMode === 'deg') {
      expr = expr.replace(/\bsin\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(Math.sin(toRadians(val)));
      });
      expr = expr.replace(/\bcos\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(Math.cos(toRadians(val)));
      });
      expr = expr.replace(/\btan\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(Math.tan(toRadians(val)));
      });
      expr = expr.replace(/\basin\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(toDegrees(Math.asin(val)));
      });
      expr = expr.replace(/\bacos\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(toDegrees(Math.acos(val)));
      });
      expr = expr.replace(/\batan\(([^)]+)\)/g, (_, arg) => {
        const val = parseFloat(evaluateExpression(arg.trim(), angleMode));
        return String(toDegrees(Math.atan(val)));
      });
    }

    // Replace remaining math functions
    expr = expr.replace(/\bsqrt\(/g, 'sqrt(');
    expr = expr.replace(/\bcbrt\(/g, 'cbrt(');
    expr = expr.replace(/\blog10\(/g, 'log10(');
    expr = expr.replace(/\blog\(/g, 'log10(');
    expr = expr.replace(/\bln\(/g, 'log(');
    expr = expr.replace(/\babs\(/g, 'abs(');
    expr = expr.replace(/\bfloor\(/g, 'floor(');
    expr = expr.replace(/\bceil\(/g, 'ceil(');
    expr = expr.replace(/\bmod\b/g, 'mod');
    expr = expr.replace(/\bpow\(/g, 'pow(');
    expr = expr.replace(/\^/g, '^');
    expr = expr.replace(/%/g, '/100');

    const result = math.evaluate(expr);

    if (result === undefined || result === null) {
      throw new Error('Invalid expression');
    }

    const num = typeof result === 'number' ? result : Number(result);

    if (!isFinite(num)) {
      if (num === Infinity) return 'Infinity';
      if (num === -Infinity) return '-Infinity';
      throw new Error('Result is not a number');
    }

    // Format the result
    if (Number.isInteger(num) && Math.abs(num) < 1e15) {
      return String(num);
    }

    // Limit decimal places
    const formatted = parseFloat(num.toPrecision(12));
    return String(formatted);
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Evaluation error');
  }
}

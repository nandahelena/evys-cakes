// Contorno de ondas do guia de identidade: n arcos para fora; k maior = ondas mais rasas.
export function scallop(n: number, R: number, k: number, c: number): string {
  const chord = 2 * R * Math.sin(Math.PI / n);
  const b = ((chord / 2) * k).toFixed(3);
  const point = (i: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return `${(c + R * Math.cos(a)).toFixed(3)} ${(c + R * Math.sin(a)).toFixed(3)}`;
  };
  let d = `M${point(0)}`;
  for (let i = 1; i <= n; i++) d += `A${b} ${b} 0 0 1 ${point(i % n)}`;
  return `${d}Z`;
}

import { validateVin } from "../validateVin";
describe("VIN validation", () => {
  const valids = ["1HGCM82633A004352","5YJ3E1EA7HF000337","JHMCM56557C404453"];
  it.each(valids)("valid %s", (v)=> expect(validateVin(v).ok).toBe(true));
  it("invalid format length", ()=> expect(validateVin("1HGCM82633A00435").ok).toBe(false));
  it("invalid contains I", ()=> expect(validateVin("1HGCM82633A00I352").ok).toBe(false));
  it("invalid check digit", ()=>{
    const base="1HGCM82633A004352";
    const mutated=base.slice(0,8)+(base[8]==="X"?"1":"X")+base.slice(9);
    const r=validateVin(mutated);
    expect(r.ok).toBe(false);
    // @ts-ignore
    expect(r.code).toBe("422_CHECK_DIGIT_FAIL");
  });
});

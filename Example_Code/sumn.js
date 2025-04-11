
function sumn(...nums) {
    return nums.reduce((acc, val) => acc + val, 0);
  }
  
  if (require.main === module) {
    const args = process.argv.slice(2).map(Number).filter(n => !isNaN(n));
    const result = sumn(...args);
    console.log(`Sum = ${result}`);
  }
  
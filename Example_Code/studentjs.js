function hellojs(event, context) {
    const name = event.name || "Unknown";
    const age = event.age || "N/A";
    const cgpa = event.cgpa || "N/A";
    return `Student ${name} (Age: ${age}) has a CGPA of ${cgpa}`;
  }
  
  if (require.main === module) {
    const [,, name, age, cgpa] = process.argv;
  
    const event = { name, age, cgpa };
    const context = {};
  
    console.log(hellojs(event, context));
  }
  
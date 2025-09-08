function calculateBmi(height: number, weight: number) {
  const heightInMeters = height / 100;
  const bmi = weight / heightInMeters ** 2;

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}

if (require.main === module) {
  const args = process.argv.slice(2).map(Number);
  if (args.length !== 2) {
    throw new Error(
      'Please provide exactly two arguments: height (cm) and weight (kg)'
    );
  }

  if (args.every((n) => !isNaN(Number(n)))) {
    console.log(calculateBmi(args[0], args[1]));
  } else {
    throw new Error('Provided values were not numbers!');
  }
}
export { calculateBmi };

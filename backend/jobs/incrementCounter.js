import User from "../models/User.js";

export const incrementCounter = async (userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      user = new User({ _id: userId, counter: 0, prizes: 0 });
    }

    // Increment the counter
    user.counter += 1;

    // Determine if the user gets points or a prize
    const random = Math.random();
    if (random < 0.5) {
      user.counter += 10; // 50% chance for 10 points
    } else if (random < 0.75) {
      user.prizes += 1; // 25% chance for a prize
    }

    await user.save();
    return { counter: user.counter, prizes: user.prizes };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

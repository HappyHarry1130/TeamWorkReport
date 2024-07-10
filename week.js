const getPreviousWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const previousWeekDays = [];

    for (let i = 1; i <= 7; i++) {
        const previousDay = new Date(today);
        previousDay.setDate(today.getDate() - dayOfWeek - i);
        const formattedDate = previousDay.toISOString().split('T')[0].replace(/-/g, '');
        previousWeekDays.push(formattedDate);
    }

    const fromdate = previousWeekDays[previousWeekDays.length - 1]; // First day of the previous week
    const todate = previousWeekDays[0]; // Last day of the previous week

    console.log({ fromdate, todate });
    return { fromdate, todate };
}
module.exports = { getPreviousWeekRange };
// const { fromdate, todate } = getPreviousWeekRange();
// console.log(`From Date: ${fromdate}, To Date: ${todate}`);
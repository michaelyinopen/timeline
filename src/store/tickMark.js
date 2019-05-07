import { useMemo } from 'react';
import {
    startOfDay,
    startOfHour,
    startOfMinute,
    differenceInMilliseconds,
    addMilliseconds,
    isAfter,
    isWithinInterval,
    eachDayOfInterval,
    addDays,
} from 'date-fns/fp';
import { maxMajorTickMarksOnScreen, maxMinorTickMarksOnScreen } from '../constants';
import {
    useViewStartTime,
    useViewEndTime,
    useMinTime,
    useMaxTime,
} from './useSelector';

// date format string too?
export const tickMarkLevel = new Map([
    ["1m", { milliseconds: 60000, startFunc: startOfMinute, timeFormat: "HH:mm", timeLabelWidth: 48 }],//timeLabelWidth(px)
    ["5m", { milliseconds: 300000, startFunc: startOfHour, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["10m", { milliseconds: 600000, startFunc: startOfHour, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["30m", { milliseconds: 1800000, startFunc: startOfHour, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["1h", { milliseconds: 3600000, startFunc: startOfHour, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["6h", { milliseconds: 21600000, startFunc: startOfDay, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["12h", { milliseconds: 43200000, startFunc: startOfDay, timeFormat: "HH:mm", timeLabelWidth: 48 }],
    ["1D", { milliseconds: 86400000, startFunc: startOfDay, timeFormat: "d MMM", timeLabelWidth: 56 }],
]);

export const getTickMarkLevel = factor => duration => {
    for (let [, value] of tickMarkLevel) {
        if (duration <= factor * value.milliseconds) {
            return value;
        }
    }
    return Array.from(tickMarkLevel)[tickMarkLevel.size - 1][1];
};

export const getMajorTickMarkLevel = getTickMarkLevel(maxMajorTickMarksOnScreen);

export const getMinorTickMarkLevel = getTickMarkLevel(maxMinorTickMarksOnScreen);

export const tickMarkType = {
    major: "major",
    minor: "minor"
};

export const timeAxisLabelType = {
    time: "time",
    day: "day"
};

//#region TickMarkPositions
const getTickMarkPositions = ({ start: viewStart, end: viewEnd }, { start: minTime, end: maxTime } = {}) => {
    const minStartTime = minTime ? minTime : viewStart;
    const maxEndTime = maxTime ? maxTime : viewEnd;
    const duration = differenceInMilliseconds(viewStart)(viewEnd);
    const majorTickMarkLevel = getMajorTickMarkLevel(duration);
    let minorTickMarkLevel = getMinorTickMarkLevel(duration);
    if (majorTickMarkLevel === minorTickMarkLevel) {
        minorTickMarkLevel = null;
    }

    const startFunc = majorTickMarkLevel.startFunc;
    const stepMilliseconds = minorTickMarkLevel ? minorTickMarkLevel.milliseconds : majorTickMarkLevel.milliseconds;

    const startingStep = startFunc(minStartTime);
    const differenceFromStartStep = differenceInMilliseconds(startingStep);
    const isMajor = date => differenceFromStartStep(date) % majorTickMarkLevel.milliseconds === 0;
    const getTickMarkType = date => isMajor(date) ? tickMarkType.major : tickMarkType.minor;

    let tickMarkPositions = [];
    let currentStep = startingStep;
    while (!isAfter(maxEndTime)(currentStep)) {
        if (isWithinInterval({ start: minStartTime, end: maxEndTime })(currentStep)) {
            const date = currentStep;
            const type = getTickMarkType(date);
            tickMarkPositions.push({
                key: `${type}_${date.getTime()}`,
                date,
                type,
            });
        }
        currentStep = addMilliseconds(stepMilliseconds)(currentStep);
    }
    return tickMarkPositions;
}

// all or only displayed?
export const useAllTickMarkPositions = () => {
    const viewStart = useViewStartTime();
    const viewEnd = useViewEndTime();
    const minTime = useMinTime();
    const maxTime = useMaxTime();

    const allTickMarkPositons = useMemo(
        () => {
            return getTickMarkPositions(
                { start: viewStart, end: viewEnd },
                { start: minTime, end: maxTime }
            );
        },
        [viewStart, viewEnd, minTime, maxTime]
    );
    return allTickMarkPositons;
};

// returns viewStart, viewEnd and days
export const useTimeAxisLabelPositions = showDay => {
    const viewStart = useViewStartTime();
    const viewEnd = useViewEndTime();

    const timeAxisLabelPositions = useMemo(
        () => {
            const daysOfView = showDay ? eachDayOfInterval({ start: viewStart, end: viewEnd }) : [];
            return [
                // beginning
                {
                    key: `${timeAxisLabelType.time}_${viewStart.getTime()}`,
                    type: timeAxisLabelType.time,
                    date: viewStart,
                },
                // days
                ...daysOfView.map(d => {
                    const type = timeAxisLabelType.day;
                    const start = d;
                    const end = addDays(1)(d);
                    return {
                        key: `${type}_${start.getTime()}_${end.getTime()}`,
                        type,
                        dateInterval: { start, end },
                    };
                }),
                // ending
                {
                    key: `${timeAxisLabelType.time}_${viewEnd.getTime()}`,
                    type: timeAxisLabelType.time,
                    date: viewEnd,
                },
            ];
        },
        [viewStart, viewEnd]
    );
    return timeAxisLabelPositions;
};
//#endregion TickMarkPositions

export const useTickMarkLevelSettings = () => {
    const viewStart = useViewStartTime();
    const viewEnd = useViewEndTime();
    const duration = differenceInMilliseconds(viewStart)(viewEnd);
    const majorTickMarkLevel = getMajorTickMarkLevel(duration);
    return majorTickMarkLevel;
};
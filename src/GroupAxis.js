import React, { useMemo } from 'react';
import {
  useGroupHeight,
  useGroupIds,
  useGroup,
} from './store/useSelector';
import { Tooltip } from '@material-ui/core';
import useMemoArray from './functions/useMemoArray';
import classNames from 'classnames/bind';
import timelineStyles from '../css/Timeline.module.css';

const cx = classNames.bind(timelineStyles);

const GroupHeader = ({
  id
}) => {
  const group = useGroup(id);
  const { title, description } = group;
  const groupHeight = useGroupHeight(id);
  return useMemo(
    () => (
      <div className={cx("timeline__group-header-wrapper")} style={{ height: `${groupHeight}px` }}>
        <Tooltip title={description} placement="right">
          <div className={cx("timeline__group-header")}>
            {title}
          </div>
        </Tooltip>
      </div>
    ),
    [title, description, groupHeight]
  );
};

const GroupAxis = () => {
  const groupIds = useGroupIds();
  const groupIdsMemo = useMemoArray(groupIds);

  return useMemo(
    () => (
      <div className={cx("timeline__group-axis")}>
        <ol className={cx("timeline__list--none-style")}>
          {groupIds.map(gId => <li key={gId}><GroupHeader key={gId} id={gId} /></li>)}
        </ol>
      </div >
    ),
    [groupIdsMemo]
  );
};

export default GroupAxis;
import React, { useCallback, useContext, useMemo } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { timelineThrottleWait } from './constants';
import GroupComponentContext from './GroupComponentContext';
import TimelineDispatchContext from './TimelineDispatchContext';
import { setGroupHeight } from './store/actionCreators';
import { useItemIdsOfGroup } from './store/useSelector';
import { useGroupItemsHeight } from './store/groupItemHeight';
import ItemWrapper from './ItemWrapper';
import useMemoArray from './functions/useMemoArray';
import classNames from 'classnames/bind';
import timelineStyles from '../css/Timeline.module.css';

const cx = classNames.bind(timelineStyles);

// todo: include subGroup
const GroupWrapper = ({
  id,
  onResize,
  GroupComponent,
  childrenOfGroup
}) => {
  return (
    <div className={cx("timeline__group-wrapper")}>
      <ReactResizeDetector
        handleHeight
        onResize={onResize}
        refreshMode="throttle"
        refreshRate={timelineThrottleWait}
        refreshOptions={{ 'leading': true, 'trailing': true }}
      />
      <GroupComponent id={id} children={childrenOfGroup} />
    </div >
  );
};

const GroupWrapperMemo = React.memo(GroupWrapper);

const GroupWrapperConnect = ({
  id
}) => {
  const itemIds = useItemIdsOfGroup(id);
  const itemIdsMemo = useMemoArray(itemIds);
  const groupItemsHeight = useGroupItemsHeight(id);

  const GroupComponent = useContext(GroupComponentContext);

  const dispatch = useContext(TimelineDispatchContext);
  const onResize = useCallback((_width, height) => {
    dispatch(setGroupHeight(id, height));
  }, [dispatch, id]);


  const itemWrappers = useMemo(
    () => (
      <React.Fragment>
        {itemIds.map(iId => <li key={iId}><ItemWrapper key={iId} id={iId} /></li>)}
      </React.Fragment>
    ),
    [itemIdsMemo]
  );

  const childrenOfGroup = useMemo(
    () => (
      <ol className={cx({ "timeline__items": true, "timeline__list--none-style": true })} style={{ height: groupItemsHeight }}>
        {itemWrappers}
      </ol >
    ),
    [itemWrappers, groupItemsHeight]
  );

  return (
    <GroupWrapperMemo
      id={id}
      onResize={onResize}
      GroupComponent={GroupComponent}
      childrenOfGroup={childrenOfGroup}
    />
  );
};

export default GroupWrapperConnect;
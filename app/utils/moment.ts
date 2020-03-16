import moment from 'moment';
import { momentFormat } from '@/config';
// 将时间标签数据转变为特定格式的moment
const formatTimeTagToMomentTime = (tags: TableItem[], tagList: TagItem[]) => {
  const timeTagNameArr = tagList
    .filter(i => i.tagType == '时间')
    .map(i => i.tagName);
  for (const i of tags) {
    for (const j of timeTagNameArr) {
      i[j] && (i[j] = moment(i[j]).format(momentFormat));
    }
  }
};

const momentTimeTo = (tagList, formData) => {
  const timeTagNameArr = tagList
    .filter(i => i.tagType == '时间')
    .map(i => i.tagName);
  for (const i of data) {
    for (const j of timeTagNameArr) {
      i[j] && (i[j] = moment(i[j]).format(momentFormat));
    }
  }
};

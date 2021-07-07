import { dateFormat } from '@/utils/tool';
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';
import { deletePage, getPageData, savePageContent } from '@core/editor';
export const getPage = (userid: number) => {
  if (userid == -1) return;
  return getPageData(userid).then(res => {
    const page = res.page.map((item: any) => {
      return {
        id: item.pageid,
        key: item.pageid,
        name: item.name,
        sourceid: `source_${item.pageid}_*`,
        groupid: item.groupid,
        publish: item.publish ? '已发布' : '未发布',
        create: dateFormat(item.create),
        update: dateFormat(item.update),
        delete: item.delete ? dateFormat(item.delete) : null,
        url: item.visit_link,
        visitKey: item.visitKey,
        description: item.description
      };
    });
    setUserPage(page);
    setPageGroup(res.groups);
  });
};

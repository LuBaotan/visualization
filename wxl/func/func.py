# import requests
# import parsel
# import numpy
# import csv
#
# # 模拟浏览器：字典数据类型
# headers={
#     # 用户代理
#     'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
# }
# # 请求链接
# url = 'https://www.espn.com/nba/team/stats/_/name/lal/los-angeles-lakers'
# response = requests.get(url=url, headers=headers, verify=False)
# # 获取响应网页的文本数据，response是一个字符类的对象
# html_data = response.text
# # print(html_data)
# # 转换数据类型
# selector = parsel.Selector(html_data)
# # print(selector)
# lis = selector.css('.Table__TR.Table__TR--sm.Table__even')
# print(lis)
# for li in lis:
#     ed = li.css('.Table__TD span::text').get()
#     print(ed)
import time

import requests
import parsel
import numpy
import csv

# 模拟浏览器：字典数据类型
def GetDatas(URL, OUTPUT):
    names = []
    datas = []
    results = []
    headers={
        # 用户代理
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    # 请求链接
    url = URL
    requests.packages.urllib3.disable_warnings()
    response = requests.get(url=url, headers=headers, verify=False)
    # 获取响应网页的文本数据，response是一个字符类的对象
    html_data = response.text
    # print(html_data)
    # 转换数据类型
    selector = parsel.Selector(html_data)
    # print(selector)
    lis = selector.css('.Table__TR.Table__TR--sm.Table__even')# Table__TR Table__TR--sm Table__even
    # print(lis)
    for li in lis:
        tn = li.css('.Table__TD a::text').getall()
        td = li.css('.Table__TD span::text').getall()
        if len(tn) == 1:
            # print(tn)
            names.append(tn)
        if len(td) == 13:
            # print(td)
            datas.append(td)
    # print(names)
    # print(datas)
    for i in range(0, len(datas)):
        results.append(names[i]+datas[i])
        # print(names[i]+datas[i])
    # print(results)
    # print(len(results))
    with open(OUTPUT, mode='a', encoding='utf-8', newline='') as f:
         csv_write = csv.writer(f)
         for i in range(0, len(results)):
            csv_write.writerow(results[i])
    print(len(results),"records in ",URL," complete!")

def merge_strings(str1, str2):
    # 将输入字符串按照'/'分割成列表
    parts1 = str1.split('/')
    parts2 = str2.split('/')
    # 取第一个部分
    result_parts = [parts1[0]]
    # 将第一个部分和第二个字符串的其余部分合并
    result_parts.extend(parts2)
    # 将合并后的列表中的元素用'/'连接成字符串
    result_str = '/'.join(result_parts)
    return result_str

if __name__ == '__main__':
    # https://www.espn.com/nba/team/stats/_/name/bos/boston-celtics
    # https://www.espn.com/nba/team/stats/_/name/bos/season/2023/seasontype/2
    # https://www.espn.com/nba/team/stats/_/name/bos/season/2022/seasontype/2

    # https://www.espn.com/nba/team/stats/_/name/chi/chicago-bulls
    # https://www.espn.com/nba/team/stats/_/name/chi/season/2023/seasontype/2

    # https://www.espn.com/nba/team/stats/_/name/atl/atlanta-hawks
    # https://www.espn.com/nba/team/stats/_/name/atl/season/2023/seasontype/2
    teams = ['bos/boston-celtics', 'chi/chicago-bulls', 'atl/atlanta-hawks',
             'bkn/brooklyn-nets', 'cle/cleveland-cavaliers', 'cha/charlotte-hornets',
             'ny/new-york-knicks', 'det/detroit-pistons', 'mia/miami-heat',
             'phi/philadelphia-76ers', 'ind/indiana-pacers', 'orl/orlando-magic',
             'tor/toronto-raptors', 'mil/milwaukee-bucks', 'wsh/washington-wizards',
             'den/denver-nuggets', 'gs/golden-state-warriors', 'dal/dallas-mavericks',
             'min/minnesota-timberwolves', 'lac/la-clippers', 'hou/houston-rockets',
             'okc/oklahoma-city-thunder', 'lal/los-angeles-lakers', 'mem/memphis-grizzlies',
             'por/portland-trail-blazers', 'phx/phoenix-suns', 'no/new-orleans-pelicans',
             'utah/utah-jazz', 'sac/sacramento-kings', 'sa/san-antonio-spurs',
             ]

    for p in range(12, 22): # [10.21]:
        for team in teams:
            GetDatas("https://www.espn.com/nba/team/stats/_/name/" + merge_strings(team, 'season/20'+str(p)+'/seasontype/2'),
                    'NBA_team_datas_20'+str(p-1)+'_'+str(p)+'rgl.csv')
            time.sleep(10)
    # for team in teams:
    #     # GetDatas("https://www.espn.com/nba/team/stats/_/name/" + team, 'NBA_team_datas_2023.csv')
    #     # GetDatas("https://www.espn.com/nba/team/stats/_/name/" + merge_strings(team, 'season/2023/seasontype/2'),
    #     #          'NBA_team_datas_2022_23rgl.csv')
    #     GetDatas("https://www.espn.com/nba/team/stats/_/name/" + merge_strings(team, 'season/2022/seasontype/2'),
    #              'NBA_team_datas_2021_22rgl.csv')
    #
    #     time.sleep(10)

const barCharts1 = `{
        "xLabel": ["Mon", "The", "Wed", "Thu", "Fri"],
        "data":[
            {
                "name":"first",
                "data":[1, 2, 3, 4, 5]
            },
            {
                "name":"second",
                "data":[2 ,3, 4, 5, 6]
            }
        ]
}`;

const barCharts2 = `{
        "xLabel": ["总费用", "房租", "水电费", "交通费", "伙食费", "日用品数"],
        "data":[
            {
                "name":"辅助",
                "data":[0, 1700, 1400, 1200, 300, 0]
            },
            {
                "name":"生活费",
                "data":[2900, 1200, 300, 200, 900, 300]
            }
        ]
}`;

export default {
  barCharts1,
  barCharts2
};

export const formatElementData = {
  barCharts1: function (options: object, data: string) {
    console.log('formnm', JSON.parse(data));
    const _data = JSON.parse(data);
    let _options = JSON.parse(JSON.stringify(options));
    if (_options['xAxis']) {
      _options['xAxis'] = {
        ..._options['xAxis'],
        data: _data['xLabel']
      };
    } else {
      _options['xAxis'] = {
        type: 'category',
        data: _data['xLabel']
      };
    }
    _options['series'] = _data['data'].map((item: any) => {
      return { name: item['name'], data: item['data'], type: 'bar' };
    });
    _options['legend'] = {
      ..._options['legend'],
      data: _data['data'].map((item: any) => {
        return item['name'];
      })
    };
    console.log(_options);
    return _options;
  },
  barCharts2: function (options: object, data: string) {
    console.log('formnm', data);
    const _data = JSON.parse(data);
    let _options = JSON.parse(JSON.stringify(options));
    if (_options['xAxis']) {
      _options['xAxis'] = {
        ..._options['xAxis'],
        data: _data['xLabel']
      };
    } else {
      _options['xAxis'] = {
        type: 'category',
        data: _data['xLabel']
      };
    }
    _options['series'] = [
      {
        name: _data['data'][0]['name'],
        type: 'bar',
        stack: '总量',
        itemStyle: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: _data['data'][0]['data']
      },
      {
        name: _data['data'][1]['name'],
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          position: 'inside'
        },
        data: _data['data'][1]['data']
      }
    ];
    _options['legend'] = {
      ..._options['legend'],
      data: _data['data'].map((item: any) => {
        return item['name'];
      })
    };
    console.log(_options);
    return _options;
  }
};

import { useEffect, useState, useCallback } from 'react'
import { getUserTreePermission } from '../services/api'

const unique = (arr: [], key: string = 'id') => {
  const map = {}
  arr.forEach(item => {
    if (!map[item[key]]) {
      map[item[key]] = item
    }
  })
  return Object.values(map)
}

const getCities = (regions: any[], area: any[]) => {
  let cities: any[] = []
  if (area) {
    regions.forEach((region: any) => {
      area.map((area: any) => {
        if (!area || area === region.id) {
          cities.push(...region.cities)
        }
      })
    })
  }
  cities = unique(cities)
  return cities
}
const getBuildings = (regions: any[], selCity: any[], area: any[]) => {
  let currCity: any[] = []
  if (area) {
    area.map((area: any) => {
      let currArea = regions.find((region: any) => region.id === area)
      currArea &&
        currArea.cities.forEach((city: any) => {
          selCity &&
            selCity.map((selCity: any) => {
              if (!selCity || selCity === city.id) {
                currCity.push(...city.buildings)
              }
            })
        })
    })
  }
  currCity = unique(currCity)
  return currCity
}

export default () => {
  const [data, setData] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])

  useEffect(() => {
    const initTreeData = async () => {
      const developerId = localStorage.getItem('developerId')
      const res = await getUserTreePermission({ developerId })
      setRegions(res.regions)
    }
    initTreeData()
  }, [])

  const setArea = useCallback(
    area => {
      setData([area])
    },
    [data]
  )

  const setCity = useCallback(
    city => {
      setData([data[0], city])
    },
    [data]
  )
  const setBuilding = useCallback(
    building => {
      setData([data[0], data[1], building])
    },
    [data]
  )

  return {
    data,
    setData,
    regions,
    area: data[0],
    setArea,
    city: data[1],
    setCity,
    building: data[2],
    setBuilding,
    cityOptions: getCities(regions, data[0]),
    buildingOptions: getBuildings(regions, data[1], data[0]),
  }
}

import { cusGetDone } from "../services/api";

export default {
  namespace: 'clientDone',
  state: {
    data: [],
    loading: false
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( cusGetDone, payload )
      yield put({
        type: 'saveData',
        payload: res.data
      })
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( cusGetDone, payload )
      console.log(res.data)
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          listData.push({
            ...item[0],
            cusUsername: item[1].username,
            cusTel: item[1].tel,
            couUsername: item[2].username,
            couTel: item[2].tel,
            isRate: item[4]?true:false
          })
        })
        yield put({
          type: 'saveData',
          payload: listData
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    }
  },
  reducers: {
    saveData( state, {payload} ){
      return {
        ...state,
        data: payload
      }
    },
    changeLoading( state, {payload} ){
      return {
        ...state,
        loading: payload
      }
    }
  }
}

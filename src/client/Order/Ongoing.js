import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar, ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import RowItem from './Ongoing_item'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

@connect( state=>({
  client_id: state.client_login.client_id,
  loading: state.clientOngoing.loading,
  data: state.clientOngoing.data,
  orderType: state.orderType.data
}) )
export default class Ongoing extends Component {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state={
      data: [],
      dataSource,
      refreshing: false,
      isOver: false
    }
  }

  componentDidMount(){
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.dispatch({
      type: 'clientOngoing/getData',
      payload: {
        cusId: this.props.client_id
      }
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      refreshing: false
    })
    if ( nextProps.data!==this.props.data ) {
      if (nextProps.data.length===0) {
        this.setState({
          isOver: true
        })
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
      })
    }
  }

  onRefresh=e=> {
    this.setState({
      refreshing: true,
    })
    this.props.dispatch({
      type: 'clientOngoing/refresh',
      payload: {
        cusId: this.props.client_id
      }
    })
  }

  render(){
    const row = (item)=>(
      <RowItem history={this.props.history} data={item} orderType={this.props.orderType} />
    )
    return <div>
      <NavBar
        leftContent={<div onClick={ e=>this.props.history.goBack() } >返回</div>}
      >进行中订单</NavBar>
      <ListView
        style={{height: document.documentElement.clientHeight-45,
          backgroundColor: '#f1f1f1',
          width: document.documentElement.clientWidth}}
        renderBodyComponent={() => <MyBody />}
        dataSource={this.state.dataSource}
        renderRow={row}
        renderHeader={ ()=> <div style={{display: 'flex',
          justifyContent: 'center', paddingTop: 10}} >
          <ActivityIndicator animating={this.props.loading} ></ActivityIndicator>
        </div> }
        renderFooter={ (e)=><div style={{textAlign: 'center'}} >
          {this.state.isOver&&<span style={{}} >没有订单了...</span>}
        </div> }
        pullToRefresh={
          <PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
      />
    </div>
  }
}

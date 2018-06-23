import React, { Component } from 'react'
import { Flex, Modal } from 'antd-mobile'
import { cusCancelOrder } from '../../services/api'

const FlexItem = Flex.Item

export default class Ongoing_item extends Component {

  constructor(props){
    super(props)
    this.state = {
      isCancel: false
    }
  }

  renderOrderType = id => {
    for (var i = 0; i < this.props.orderType.length; i++) {
      if (id == this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  cancelOrder = id=> {
    cusCancelOrder({
      id
    })
      .then( res=>{
        console.log(res.status)
        if (res.status==='OK') {
          Modal.alert('订单取消成功', '', [{
            text: '确认', onPress: ()=> {
              this.setState({
                isCancel: true
              })
            }
          }])
        } else {
          Modal.alert('快递员已经在来的路上来', '暂不能取消订单', [{
            text: '确认', onPress: ()=>{
              this.props.history.replace('/cont/ongoing')
            }
          }])
        }
      })
      .catch( err=>{
        Modal.alert('暂不能取消订单，请联系管理员', '', [{
          text: '确认', onPress: ()=>{}
        }])
      })
  }

  renderOrderItem = (typeId, data) => {
    if (typeId==2) {  // 代购服务订单
      return <div>
        <Flex wrap='wrap'>
          <FlexItem style={{flex: 'auto'}} >订单编号：{data.ono}</FlexItem>
          <FlexItem style={{flex: 'auto'}} >{this.renderOrderType(data.typeId)}</FlexItem>
        </Flex>
        { data.couId&&
        <Flex>
          <FlexItem>快递员姓名：{data.couUsername}</FlexItem>
          <FlexItem>
            <a href={`tel:${data.couTel}`} ><img style={{width: 20, height: 20}} src="/tel.png" alt=""/> {data.couTel}</a>
          </FlexItem>
        </Flex>
        }
        <Flex>代购物品：{data.goodsType}</Flex>
        <Flex>
          物品费用: {data.couPay} 元
        </Flex>
      </div>
    } else {  //  同城急送订单或快递物流订单
      return <div>
        <Flex wrap='wrap'>
          <FlexItem style={{flex: 'auto'}} >订单编号：{data.ono}</FlexItem>
          <FlexItem style={{flex: 'auto'}} >{this.renderOrderType(data.typeId)}</FlexItem>
        </Flex>
        { data.couId&&
        <Flex>
          <FlexItem>快递员姓名：{data.couUsername}</FlexItem>
          <FlexItem>
            <a href={`tel:${data.couTel}`} ><img style={{width: 20, height: 20}} src="/tel.png" alt=""/> {data.couTel}</a>
          </FlexItem>
        </Flex>
        }
        <Flex>
          目标地点：{data.receiverAddr}
        </Flex>
      </div>
    }
  }

  render(){
    const {data} = this.props
    return <div
      style={{backgroundColor: '#fff', padding: 5, marginBottom: 10,
              display: this.state.isCancel?'none':''
      }}
    >
      {this.renderOrderItem(data.typeId, data)}
      <Flex>
        订单预算费用：{data.actualFee} 元
      </Flex>
      {!data.couId&&
      <Flex justify='center' style={{margin: '5px 0'}} >
        <button style={{backgroundColor:'#ff6700',
          border: 'none', color: '#fff', width: 100,
          borderRadius: 3, textAlign: 'centers'
        }} onClick={ e=>this.cancelOrder(data.id) } >取消订单</button>
      </Flex>
      }
    </div>
  }
}
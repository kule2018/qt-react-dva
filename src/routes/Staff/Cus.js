import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, message} from 'antd';
import Frontdesk_table from './CusTable'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  // categoryList: state.drop.category
  roleId: state.admin_login.roleId
}))
@Form.create()
export default class Cai extends PureComponent {
  state = {
    selectedRows: [],
    selectKeys: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10,
    delete_key: []
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'customer/getData',
      payload: {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        roleId: this.props.roleId
      }
    })
  }

  handle_delete = () => {
    if ( this.state.selectKeys.length==0 ) {
      message.error('请选择需要删除的用户', 1)
      return false
    }
  }

  handle_page_change = (page, pageSize) => {
    this.props.dispatch({
      type: 'customer/getData',
      payload: {
        pageNo: page,
        pageSize: this.state.pageSize,
        ...this.state.formValues
      }
    })
    this.setState({
      pageNo: page
    })
  }

  handleSelectRows = (rows, key) => {
    this.setState({
      selectedRows: rows,
      selectKeys: key
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
        pageSize: 1
      });
      this.props.dispatch({
        type: 'customer/getData',
        payload: {
          pageNo: 1,
          pageSize: this.state.pageSize,
          ...fieldsValue
        }
      })
    });
  }

  handle_reset = () => {
    this.props.form.resetFields()
    this.setState({
      formValues: {},
      pageNo: 1
    })
    this.props.dispatch({
      type: 'customer/getData',
      payload: {
        pageNo: 1,
        pageSize: 10,
      }
    })
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6} sm={10}>
            <FormItem label="电话">
              {getFieldDecorator('tel', {
                normalize: (v, prev) => {
                  // 电话号码正则验证
                  if (v && !/^(([1-9]\d*)|0)$/.test(v)) {
                    if (v === '.') {
                      return '0';
                    }
                    return prev;
                  }
                  return v;
                },
              })(
                <Input placeholder="输入用户电话查询" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={10} >
            <FormItem label="姓名">
              {getFieldDecorator('username')(
                <Input placeholder="输入用户姓名查询" />
              )}
            </FormItem>
          </Col>
          {/*<Col md={6} sm={10} >*/}
            {/*<FormItem label="地址">*/}
              {/*{getFieldDecorator('address')(*/}
                {/*<Input placeholder="输入用户地址查询" />*/}
              {/*)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={5} sm={10} >
            <FormItem label="激活／未激活">
              {getFieldDecorator('is_active')(
                <Select>
                  <Option value={0} >未激活</Option>
                  <Option value={1} >激活</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10}>
            <FormItem>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">确认</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handle_reset}>重置</Button>
            </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { selectedRows } = this.state;

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{marginBottom: '15px'}} >
              { this.renderSimpleForm() }
            </div>
            <Frontdesk_table
              // data={this.props.data}
              // loading={this.props.loading}
              selectedRows={selectedRows}
              formValues={this.state.formValues}
              onSelectRow={this.handleSelectRows}
              onChange={this.handle_page_change}
              pageNo = {this.state.pageNo}
              delete_key = {this.state.delete_key}
              // total = {this.props.total}
              history={this.props.history}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}


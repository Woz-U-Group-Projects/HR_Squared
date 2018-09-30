//import the necessary files
import React from 'react';
import {PanelGroup,Panel,Button,ButtonToolbar,ListGroup,ListGroupItem} from 'react-bootstrap';
import {Redirect} from 'react-router';
import '../css/index.css';
import {AddEmployee} from '../components/addemployee';
import {EditEmployee} from '../components/editemployee';

//create the main class for displaying the recipes
export default class Employees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      items: [],
      showAdd: false,
      showEdit: false,
      rerenderEmployeeView: false,
      currentlyEditing: 0      
    };

    this.showAddModal = this.showAddModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  getItems() {     
    fetch('http://localhost:5000/api/employees')
    .then(results => results.json())
    .then(results => this.setState({items : results}));
  }                  

  showAddModal() {//show the new Employee Detail modal
    this.setState({showAdd: !this.state.showAdd});
  }

  showEditModal(index) {//show the edit Employee Modal
    this.setState({currentlyEditing: index, showEdit: !this.state.showEdit});
  }

  addEmployee(index) {//create a new Employee Record
    let items = this.state.items;
    
    // let url = 'http://localhost:5000/api/employees/' + (items[index].employeeId);
    // fetch(url, {
    //   method: 'POST'
    // });
  }

  editEmployee(currentlyEditing) {//edit an existing employee
    this.showEditModal(currentlyEditing);
  }

  deleteEmployee(index) {//delete an existing Employee
    let items = this.state.items;
    this.setState({rerenderEmployeeView: true});
    console.log(this.state.rerenderEmployeeView);
    console.log(items[index].employeeId);
    let url = 'http://localhost:5000/api/employees/' + (items[index].employeeId);
    fetch(url, {
      method: 'DELETE'
    });

    this.props.history.push('/bookings');
  }


  // -----------------------------------------------------------------
      

  render() {
    const employees = this.state.employees;
    const items = this.state.items;
    var currentlyEditing = this.state.currentlyEditing;
    var rerenderEmployeeView = this.state.rerenderEmployeeView;

    if (rerenderEmployeeView === true) {
      <Redirect to='/bookings' />
    };

    return(

      <div className="jumbotron">

        <h2>Employees</h2>
        <h3>{rerenderEmployeeView}</h3>
        <PanelGroup accordion id="employees">
            
            
            {items.map((item, index) => (
            <Panel eventKey={index} key={index}>
            
              <Panel.Heading>

                  <Panel.Title className="title" toggle>{item.name}</Panel.Title>
                  <Panel.Title toggle>{item.employeeId}</Panel.Title>

              </Panel.Heading>
              
              <Panel.Body collapsible>

                  <ListGroup>
                      <ListGroupItem key={(index + 1)}>Department: {item.department}</ListGroupItem>
                      <ListGroupItem key={(index + 2)}>Supervisor: {item.supervisor}</ListGroupItem>
                      <ListGroupItem key={(index + 3)}>Email: {item.email}</ListGroupItem>
                      <ListGroupItem key={(index + 4)}>Phone Ext: x{item.phone}</ListGroupItem>
                      <ListGroupItem key={(index + 5)}>{index}</ListGroupItem>
                  </ListGroup>

                  <ButtonToolbar>
                      <Button bsStyle="warning" onClick={() => {this.showEditModal(index)}}>Edit</Button>
                      <Button bsStyle="danger" onClick={() => {this.deleteEmployee(index)}}>Delete</Button>
                  </ButtonToolbar>

              </Panel.Body>

              <EditEmployee {...this.state} onShow={this.state.showEdit} onEdit={this.editEmployee} onEditModal={() => {this.showEditModal(currentlyEditing)}} currentlyEditing={currentlyEditing} employee={employees[currentlyEditing]} />
              
            </Panel>
          ))}

        </PanelGroup>

        <Button bsStyle="primary" onClick={this.showAddModal}>Add Employee</Button>

        <AddEmployee onShow={this.state.showAdd} onAdd={this.AddEmployee} onAddModal={this.showAddModal} />

      </div>

    );    
  }
};




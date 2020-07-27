const { employees } = require('../config/db');
const { employeeContainer } = require('../config/config');

const collectionName = 'employees';

exports.createEmployee = async (employee) => {
    const { body } = await employees.items.create(employee);
    return body;
}

exports.getEmployee = async (querySpec) => {

    const { result } = await employees.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.getEmployeeByEmpId = async (empId) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value`,
        parameters: [
            {
                name: '@value',
                value: Number(empId) // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const { result } = await employees.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}
import { Table } from "@mantine/core"
export const VariableEditor = (props: { variables: { key: string, value: string }[] }) => {
    const { variables } = props
    if (!variables) {
        return
    }
    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Key</Table.Th>
                <Table.Th>Value</Table.Th>

            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{variables.map((variable) => (
            <Table.Tr key={variable.key}>
                <Table.Td>{variable.key}</Table.Td>
                <Table.Td>{variable.value}</Table.Td>
            </Table.Tr>
        ))}</Table.Tbody>
    </Table >
}

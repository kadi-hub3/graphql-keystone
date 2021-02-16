const { Text, Select, Relationship } = require('@keystonejs/fields')

const bookField = {
    fields: {
        title: {
            type: Text,
            isRequired: true
        },
        body: {
            type: Text,
            isMultiline: true
        },
        status: {
            type: Select,
            options: [
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'UNPUBLISHED', label: 'Unpublished' }
            ]
        },
        author: {
            type: Relationship,
            ref: 'User',
            many: false,
            isRequired: true
        }
    }
}

module.exports = bookField
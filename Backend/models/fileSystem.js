
export default (sequelize, Sequelize) => {
  const FileSystem = sequelize.define("FileSystem", {  
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4, // Or you can use `defaultValue: uuidv4()`
      primaryKey: true,
    },
    name: { 
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        // Trim the value before setting it
        this.setDataValue('name', value.trim());
      }
    },
    parentId: {
      type: Sequelize.UUID,
      references: {
        model: 'file_system', // Assuming your User model is named 'User'
        key: '_id'   // column name.
      },
      onDelete: 'CASCADE', 
    },
    isFolder: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false, // or true depending on your requirements
      references: {
        model: 'users', // Assuming your User model is named 'User'
        key: '_id'   // column name.
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'file_system',
    timestamps: true
  });

  return FileSystem;
};
  
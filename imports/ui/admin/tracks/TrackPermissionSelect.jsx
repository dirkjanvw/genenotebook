import React from 'react';
import { Creatable as Select } from 'react-select';
import { updateTrackPermissions } from '/imports/api/genomes/updateTrackPermissions.js';


export default class TrackPermissionSelect extends React.Component {
  constructor(props){
    super(props)
  }

  selectPermissions = permissions => {
    updateTrackPermissions.call({
      trackName: this.props.trackName,
      permissions: permissions.map(permission => permission.value)
    }, (err,res) => {
      if (err){
        console.log(err)
        alert(err)
      }
    })
  }

  render(){
    return (
      <Select
        name={this.props.name}
        value={this.props.value}
        options={this.props.options}
        onChange={this.selectPermissions}
        multi={true}
      />
    )
  }
}
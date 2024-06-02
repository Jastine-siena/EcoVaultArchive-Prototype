import React from 'react'
import { Link } from 'react-router-dom'

const FIleRouterLinks = () => {
  return (
    <div className="container mt-3">
      <h2 className='text-center mt-5 mb-3'>Archive Category List</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-5">
            <div className="card-body">
              <h5 className="card-title">Tree Cutting Permits</h5>
              <p className="card-text">Archive documents for all Tree Cutting Permits transacted at PENRO-DENR. <br /></p>
              <Link to="/doclist" className="btn btn-success">View Archive</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-5">
            <div className="card-body">
              <h5 className="card-title">Tree Transport Permits</h5>
              <p className="card-text">Archive documents for all Tree Transport Permits transacted at PENRO-DENR.</p>
              <Link to="/tp" className="btn btn-success">View Archive</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-5">
            <div className="card-body">
              <h5 className="card-title">Land Title Registration</h5>
              <p className="card-text">Archive documents for all Land Title Registration Permits transacted at PENRO-DENR.</p>
              <Link to="/lt" className="btn btn-success">View Archive</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-5">
            <div className="card-body">
              <h5 className="card-title">Chainsaw Registration</h5>
              <p className="card-text">Archive documents for all Chainsaw Registrations transacted at PENRO-DENR.</p>
              <Link to="/cr" className="btn btn-success">View Archive</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-5">
            <div className="card-body">
              <h5 className="card-title">Tree Plantation Registration</h5>
              <p className="card-text">Archive documents for all Tree Plantation Registrations transacted at PENRO-DENR.</p>
              <Link to="/tpr" className="btn btn-success">View Archive</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default FIleRouterLinks
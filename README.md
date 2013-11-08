jquery.jqsorttable for CodeIgniter
==================

JQuery plugin for the sorting of the custom table.


1) Initialize plugin
----------------------------------
Example:

	$(document).ready(function() {

		$('.some_table').jqsorttable({
			group_name: 'some_table_name',	//unique name for table
			sort_field: 'login',		//default sort field
			sort_mode: 'asc',			//default sorting mode ('asc', 'desc')

			fields: {
				login: ".some_table th[name='login']",
				first_name: ".some_table th[name='first_name']",
				last_name: ".some_table th[name='last_name']",
				email: ".some_table th[name='email']",
				role: ".some_table th[name='role']",
				permission: ".some_table th[name='permission']"
			},

			on_click : function () {
				//.....

				return false;	
			},

			on_init : function () {
				//.....

				return false;	
			},

		});	
	}	

2) How to use plugin in the CodeIgniter
----------------------------------

Copy Site_jqsorttable.php file into the "libraries" folder of the application.

Example:

	$this->load->library('site_jqsorttable');		
	$sort=$this->site_jqsorttable->get_table_state('some_table_name', array('sort_field'=>'login', 'sort_mode'=>'asc'));		

	$this->db->select('id, login, first_name, last_name, email, role, permission');
	$this->db->from('user');

	if (isset($sort) && !empty($sort['sort_field']) && !empty($sort['sort_mode']) ) {
		$this->db->order_by($sort['sort_field'] , $sort['sort_mode']); 				
	}

	$query=$this->db->get();

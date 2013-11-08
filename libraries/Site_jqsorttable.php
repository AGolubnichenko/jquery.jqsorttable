<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * The library of the sorting tables
 * 
 * @package JQSortTable
 * @subpackage Core
 * @category Core
 * @author Alexey Golubnichenko
 * @version 1.0
 */
class Site_jqsorttable {
	/**
	 * The current controller
	 * 
	 * @var CI_Controller
	 */
	private $ctrl;
	
	/**
	 * Constructor
	 */
	public function __construct () {
		$this->ctrl=&get_instance();	
		$this->ctrl->load->helper('cookie');				
	}

	/**
	 * The method gets current sorting state from the cookies
	 * 
	 * @param varchar $name The name of the table
	 * @param type $default The default value of sorting state
	 * @return array The sorting state
	 */
	public function get_table_state ($name='', $default=NULL) {
		$key=$name.'_table_state';
		$table_state=get_cookie($key);
		if (isset($table_state) && trim($table_state)!='') {
			return unserialize($table_state);
		} elseif (isset ($default)) {
			return $default;
		} else {
			return NULL;
		}
	}
}

/* End of file site_jqsorttable.php */
/* Location: ./application/libraries/site_jqsorttable.php */
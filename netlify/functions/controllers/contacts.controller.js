const supabase = require('../config/supabase')

// Submit Contact Form
exports.submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      business_name,
      insta_id,
      city,
      message,
      services = []
    } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // Insert contact
    const { data: newContact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        contact: contact || null,
        business_name: business_name || null,
        insta_id: insta_id || null,
        city: city || null,
        message: message || null,
        is_contacted: false
      })
      .select()
      .single()

    if (contactError) {
      console.error('Insert contact error:', contactError)
      throw contactError
    }

    // Insert service relationships if services provided
    if (Array.isArray(services) && services.length > 0) {
      const contactServices = services.map(serviceId => ({
        contact_id: newContact.id,
        service_id: serviceId
      }))

      const { error: servicesError } = await supabase
        .from('contact_services')
        .insert(contactServices)

      if (servicesError) {
        console.error('Insert contact_services error:', servicesError)
        // Note: Contact is already inserted, you may want to handle this differently
        throw servicesError
      }
    }

    res.status(201).json({ success: true, data: newContact })
  } catch (error) {
    console.error('Submit contact error:', error)
    res.status(500).json({ 
      error: 'Failed to submit contact', 
      details: error.message 
    })
  }
}
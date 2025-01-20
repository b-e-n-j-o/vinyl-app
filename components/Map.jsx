Map.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      // ... autres props ...
      openingHours: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  // ... autres props ...
}; 
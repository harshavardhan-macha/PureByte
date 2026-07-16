import os
import sys
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ml_model import predict_unsafe_probability


class MlModelTests(unittest.TestCase):
    def test_flagged_ingredients_return_a_nontrivial_probability(self):
        probability = predict_unsafe_probability("sugar, sodium nitrite, trans fat")
        self.assertGreater(probability, 0.1)
        self.assertLessEqual(probability, 1.0)

    def test_clean_ingredients_return_a_low_probability(self):
        probability = predict_unsafe_probability("water, oats, salt")
        self.assertLessEqual(probability, 0.3)


if __name__ == "__main__":
    unittest.main()
